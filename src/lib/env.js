let env = {
  framework: framework,
  mobile: /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
}
console.log('env', env)
export{
  env
}