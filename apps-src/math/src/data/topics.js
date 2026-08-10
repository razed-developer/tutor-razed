export const topics = [
  {
    id: 'transformations',
    title: 'Transformations',
    blurb: 'Translate, stretch, compress, and reflect parent functions.',
    learn: [
      'Use y = a·f(k(x − d)) + c as the general transformation form.',
      'd moves a graph horizontally; c moves it vertically.',
      '|a| controls vertical stretch or compression; a < 0 reflects over the x-axis.',
      '|k| controls horizontal compression or stretch; k < 0 reflects over the y-axis.'
    ]
  },
  {
    id: 'parents',
    title: 'Parent Functions & Relations',
    blurb: 'Compare absolute value, radical, reciprocal, conic, exponential, logarithmic, and trigonometric families.',
    learn: [
      'Parent functions provide the base shape for an entire family.',
      'Important features include domain, range, intercepts, asymptotes, vertices, amplitude, and period.',
      'Relations such as circles and ellipses may fail the vertical line test.'
    ]
  },
  {
    id: 'inverses',
    title: 'Inverses',
    blurb: 'Reflect graphs across y = x and solve inverse equations.',
    learn: [
      'Swap x and y, then solve for y to find an inverse equation.',
      'A function must be one-to-one to have an inverse function over its full domain.',
      'The graphs of f and f⁻¹ are reflections across y = x.'
    ]
  },
  {
    id: 'composition',
    title: 'Composed Functions',
    blurb: 'Recognize inner and outer functions and evaluate compositions.',
    learn: [
      'In f(g(x)), g is applied first and f is applied second.',
      'For y = √(3x − 2), the inner function is 3x − 2 and the outer function is √x.',
      'Domains must respect every restriction introduced by the inner and outer functions.'
    ]
  },
  {
    id: 'operations',
    title: 'Operations on Functions',
    blurb: 'Add, subtract, multiply, and divide functions and relations.',
    learn: [
      '(f + g)(x) = f(x) + g(x)',
      '(fg)(x) = f(x)g(x)',
      '(f/g)(x) = f(x)/g(x), where g(x) ≠ 0.',
      'The domain of the result must satisfy all original restrictions.'
    ]
  }
];

export const parentFunctions = [
  { id:'absolute', label:'Absolute Value', formula:'|x|', fn:x=>Math.abs(x), domain:'all real x', range:'y ≥ 0' },
  { id:'radical', label:'Square Root', formula:'√x', fn:x=>x>=0?Math.sqrt(x):null, domain:'x ≥ 0', range:'y ≥ 0' },
  { id:'reciprocal', label:'Reciprocal', formula:'1/x', fn:x=>Math.abs(x)<1e-9?null:1/x, domain:'x ≠ 0', range:'y ≠ 0' },
  { id:'quadratic', label:'Quadratic', formula:'x²', fn:x=>x*x, domain:'all real x', range:'y ≥ 0' },
  { id:'exponential', label:'Exponential', formula:'2ˣ', fn:x=>2**x, domain:'all real x', range:'y > 0' },
  { id:'logarithmic', label:'Logarithmic', formula:'log₂(x)', fn:x=>x>0?Math.log2(x):null, domain:'x > 0', range:'all real y' },
  { id:'sine', label:'Sine', formula:'sin(x)', fn:x=>Math.sin(x), domain:'all real x', range:'−1 ≤ y ≤ 1' },
  { id:'cosine', label:'Cosine', formula:'cos(x)', fn:x=>Math.cos(x), domain:'all real x', range:'−1 ≤ y ≤ 1' },
  { id:'tangent', label:'Tangent', formula:'tan(x)', fn:x=>Math.abs(Math.cos(x))<0.04?null:Math.tan(x), domain:'x ≠ π/2 + nπ', range:'all real y' },
  { id:'circle', label:'Circle (upper half)', formula:'√(1−x²)', fn:x=>Math.abs(x)<=1?Math.sqrt(1-x*x):null, domain:'−1 ≤ x ≤ 1', range:'0 ≤ y ≤ 1' }
];
