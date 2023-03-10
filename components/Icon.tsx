import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { forwardRef, HTMLAttributes } from 'react';

const supportedIconsMap = {
  google: faGoogle,
};

type SupportedIconName = keyof typeof supportedIconsMap;

interface IconProps extends HTMLAttributes<SVGSVGElement> {
  name: SupportedIconName;
}

const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ name, ...otherProps }, ref) => {
    return (
      <FontAwesomeIcon
        fixedWidth={true}
        icon={supportedIconsMap[name]}
        ref={ref}
        {...otherProps}
      />
    );
  }
);

Icon.displayName = 'Icon';

export type { SupportedIconName };
export { Icon };
