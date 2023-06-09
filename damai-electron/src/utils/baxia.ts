export function getBxua() {
  if (!window.__baxia__ || !window.__baxia__.getFYModule) {
    console.error('__baxia__未初始化')
    return ''
  }
  return window.__baxia__.getFYModule.getFYToken()
}

export function getUmid() {
  if (!window.__baxia__ || !window.__baxia__.getFYModule) {
    console.error('__baxia__未初始化')
    return ''
  }
  return window.__baxia__.getFYModule.getUidToken()
}
