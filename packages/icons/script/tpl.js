export const tpl = (variables, { tpl }) => {
  return tpl`
${variables.imports};
import { FunctionComponent } from "react";
import clsx from "clsx";
${variables.interfaces};
const Com = (${variables.props}) => (  
  ${variables.jsx}
);
const ForwardRef = forwardRef(Com as any);
const Memo = memo(ForwardRef) as FunctionComponent<SVGProps<SVGSVGElement>>;
Memo.displayName = "${variables.componentName}";
export const ${variables.componentName} = Memo;
`;
};
