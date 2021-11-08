const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ')
}

const delay = (milliseconds: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), milliseconds)
  })
}

export { classNames, delay }
