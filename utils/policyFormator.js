import jsep from 'jsep';

jsep.addBinaryOp('and', 2);
jsep.addBinaryOp('or', 1);

const expression = 'Work and Friend or (Trusted and Sydney and Family)';
const ast = jsep(expression);
const groupedExpression = generateExpression(ast);
console.log(groupedExpression);

function generateExpression(node) {
  if (node.type === 'BinaryExpression') {
    return `(${generateExpression(node.left)} ${node.operator} ${generateExpression(node.right)})`;
  }
  return node.name || node.value || '';
}

export function formatPolicy(expression) {
  const ast = jsep(expression);
  return generateExpression(ast);
}
