/**
 * 创建于 2018/2/8
 * 作者: SHERlocked93
 * 功能: 15 行代码实现并发控制
 *
 * 原文: https://segmentfault.com/a/1190000013128649
 */

/**
 * @params list {Array} - 要迭代的数组
 * @params limit {Number} - 并发数量控制数
 * @params asyncHandle {Function} - 对`list`的每一个项的处理函数，参数为当前处理项，必须 return 一个Promise来确定是否继续进行迭代
 * @return {Promise} - 返回一个 Promise 值来确认所有数据是否迭代完成
 */
const mapLimit = (list, limit, asyncHandle) => {
  const recursion = arr => {
      return asyncHandle(arr.shift())
          .then(() => {
              count--
              return arr.length
                     ? recursion(arr)
                     : 'finish'
          })
  }

  const listCopy = [...list]                  // 浅复制一份，以免改变了原来的array
  const asyncList = []                        // 正在进行的所有并发异步操作
  while (limit--) {
      asyncList.push(recursion(listCopy))
  }
  return Promise.all(asyncList)             // 所有并发异步操作都完成后，本次并发控制迭代完成
}

const dataLists = [6, 4, 9, 2, 5, 1, 7, 8, 3, 11, 100, 123]
let count = 0
mapLimit(dataLists, 3, curItem => {
  return new Promise((resolve, reject) => {
      count++
      setTimeout(() => {                              // 模拟处理异步处理完了的回调
          console.log(curItem, '当前并发量:', count)
          if (curItem > 200) reject('Error happen!')
          resolve()
      }, Math.random() * 5000)
  })
}).then(response => console.log('finish', response))
