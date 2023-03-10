import { useFirebase } from '@/hooks/useFirebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  onSnapshot,
  query,
  updateDoc,
  where,
} from '@firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

type NoID<T> = Omit<T, 'id'>;

type AddDocumentFunction<T> = (
  newData: NoID<T>
) => Promise<DocumentReference<unknown>>;

type DeleteDocumentFunction = (itemId: string) => Promise<void>;

type UpdateDocumentFunction<T> = (newData: T) => Promise<void>;

type UseFirestoreCollectionHookResponse<T extends { id: string }> = {
  addDocument: AddDocumentFunction<T>;
  deleteDocument: DeleteDocumentFunction;
  documents: Array<T>;
  isLoading: boolean;
  updateDocument: UpdateDocumentFunction<T>;
};

type UseFirestoreCollectionHookOptions = {
  collectionName: string;
  disabled?: boolean;
  foreignKeyConstraints?: Array<ForeignKeyConstraintDescriptor>;
  queryConstraints?: Array<QueryConstraintDescriptor>;
  onSnapshot?: () => void;
};

type ForeignKeyConstraintDescriptor = {
  collectionName: string;
  fieldName: string;
  value: string;
};

type QueryConstraintDescriptor = {
  collectionName?: string;
  fieldName: string;
  operator?: Operator;
  value: string | Array<string>;
};

type Operator =
  | '<'
  | '<='
  | '=='
  | '>'
  | '>='
  | '!='
  | 'array-contains'
  | 'array-contains-any'
  | 'in'
  | 'not-in';

const useFirestoreCollection = <T extends { id: string }>({
  collectionName,
  disabled = false,
  foreignKeyConstraints,
  queryConstraints,
  onSnapshot: onSnapshotCallback,
}: UseFirestoreCollectionHookOptions): UseFirestoreCollectionHookResponse<T> => {
  const { firestore } = useFirebase();

  const [isLoading, setIsLoading] = useState(true);

  const [documents, setDocuments] = useState<Array<T>>([]);

  useEffect(() => {
    onSnapshotCallback?.();
  }, [documents, onSnapshotCallback]);

  useEffect(() => {
    if (disabled) {
      setDocuments([]);
      setIsLoading(false);
      return;
    }

    let q;

    if (queryConstraints?.length) {
      const computedQueryConstraints = queryConstraints.map(
        ({ collectionName = null, fieldName, operator = '==', value }) => {
          const computedValue = collectionName
            ? Array.isArray(value)
              ? value.map((v) => doc(firestore, collectionName, v))
              : doc(firestore, collectionName, value)
            : value;

          return where(fieldName, operator, computedValue);
        }
      );

      q = query(
        collection(firestore, collectionName),
        ...computedQueryConstraints
      );
    } else {
      q = query(collection(firestore, collectionName));
    }

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const snapshotResults: Array<T> = [];

      querySnapshot.forEach((doc) => {
        snapshotResults.push({
          id: doc.id,
          ...doc.data(),
        } as T);
      });

      setDocuments(snapshotResults);

      setIsLoading(false);
    });

    return unsubscribe;
  }, [collectionName, disabled, firestore, queryConstraints]);

  const addDocument = useCallback(
    async (data: NoID<T>) => {
      setIsLoading(true);

      const foreignKeys = Object.fromEntries(
        foreignKeyConstraints?.map(({ collectionName, fieldName, value }) => [
          fieldName,
          doc(firestore, collectionName, value),
        ]) ?? []
      );

      const newDocument = await addDoc(collection(firestore, collectionName), {
        ...data,
        ...foreignKeys,
      });

      setIsLoading(false);

      return newDocument;
    },
    [collectionName, firestore, foreignKeyConstraints]
  );

  const deleteDocument = useCallback(
    async (itemId: string) => {
      setIsLoading(true);
      await deleteDoc(doc(firestore, collectionName, itemId));
      setIsLoading(false);
    },
    [collectionName, firestore]
  );

  const updateDocument = useCallback(
    async (newData: T) => {
      setIsLoading(true);
      await updateDoc(doc(firestore, collectionName, newData.id), newData);
      setIsLoading(false);
    },
    [collectionName, firestore]
  );

  return {
    addDocument,
    deleteDocument,
    documents,
    isLoading,
    updateDocument,
  };
};

export type {
  AddDocumentFunction,
  DeleteDocumentFunction,
  ForeignKeyConstraintDescriptor,
  QueryConstraintDescriptor,
  NoID,
  UpdateDocumentFunction,
};
export { useFirestoreCollection };
