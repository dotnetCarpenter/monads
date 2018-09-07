let b = Promise.resolve(4).finally(() => console.log('done')).then((x) => {
  console.log('another function added this later')
  return x
});
setTimeout(() => b.then(x => console.log(x + 3)), 1000);