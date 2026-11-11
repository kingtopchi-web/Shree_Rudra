const testStr = `
<img class=brand-logo src=https://cdn.solarsquare.in/blog/wp-content/uploads/2025/11/05101757/logo.webp alt=SolarSquare width=100 height=60>
<img src=../../../cdn.solarsquare.in/blog/wp-content/uploads/2022/11/14160635/1kva-inverter-price-768x427.jpg alt="1kva">
<img src="../../../cdn.solarsquare.in/blog/wp-content/uploads/2022/09/14160234/100-Watt.png">
<link rel=stylesheet href=../../../website-assets.solarsquare.in/wp-content/cache/minify/a5ff7.css>
`;

let transformed = testStr;

// Replace relative ../.. paths for website-assets
transformed = transformed.replace(/(?:href|src)=["']?(?:\.\.\/)+website-assets\.solarsquare\.in\/([^"'\s>]+)["']?/gi, 'href="/website-assets.solarsquare.in/$1"');

// Replace relative ../.. paths for cdn.solarsquare.in
transformed = transformed.replace(/(?:href|src)=["']?(?:\.\.\/)+cdn\.solarsquare\.in\/([^"'\s>]+)["']?/gi, 'src="/cdn.solarsquare.in/$1"');

// Replace external CDN domains
transformed = transformed.replace(/https:\/\/cdn\.solarsquare\.in/g, '/cdn.solarsquare.in');
transformed = transformed.replace(/http:\/\/cdn\.solarsquare\.in/g, '/cdn.solarsquare.in');

console.log('Result of replacement:');
console.log(transformed);

