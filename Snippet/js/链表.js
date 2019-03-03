// 链表
// 单向链表
class Node {
  constructor(element, isTwoWay = false) {
    this.next = null
    this.element = element
    if (isTwoWay) {
      this.previous = null
    }
  }
}

class OneWayLList {
  constructor(isCycle = false) {
    this.isCycle = isCycle
    this.head = new Node('head')
    if (isCycle) this.head.next = this.head
  }

  find(item) {
    let currNode = this.head
    while(currNode.element !== item) {
      currNode = currNode.next
    }
    return currNode
  }

  findPrevious(item) {
    let currNode = this.head
    while(currNode.next !== null && currNode.next.element !== item) {
      currNode = currNode.next
    }
    return currNode
  }


  insert(newElement, item) {
    const newNode = new Node(newElement)
    const currNode = this.find(item)
    newNode.next = currNode.next
    currNode.next = newNode
  }

  remove(item) {
    const previousNode = this.findPrevious(item)
    if(previousNode.next !== null) {
      previousNode.next = previousNode.next.next
    }
  }

  display() {
    let currNode = this.head
    while(currNode.next !== null && (this.isCycle ? currNode.next !== this.head : true)) {
      console.log(currNode.next.element)
      currNode = currNode.next
    }
  }
}

const one = new OneWayLList()





// 双向链表
class TwoWayLList {
  constructor(isCycle = false) {
    this.isCycle = isCycle
    this.head = new Node('head', true)
    if (isCycle) {
      this.head.next = this.head
      this.head.previous = this.head
    }
  }

  find(item) {
    let currNode = this.head
    while(currNode.element !== item) {
      currNode = currNode.next
    }
    return currNode
  }

  findLast() {
    let currNode = this.head
    while(currNode.next !== null) {
      currNode = currNode.next
    }
    return currNode
  }

  insert(newElement, item) {
    const newNode = new Node(newElement, true)
    const currNode = this.find(item)
    newNode.next = currNode.next
    newNode.previous = currNode
    if(currNode.next !== null) {
      currNode.next.previous = newNode
    }
    currNode.next = newNode
  }

  remove(item) {
    const currNode = this.find(item)
    currNode.previous.next = currNode.next
    if(currNode.next !== null) {
      currNode.next.previous = currNode.previous
      currNode.next = null
    }
    currNode.previous = null
  }

  display() {
    let currNode = this.head
    while(currNode.next !== null && (this.isCycle ? currNode.next !== this.head : true)) {
      console.log(currNode.next.element)
      currNode = currNode.next
    }
  }

  disReverse() {
    let lastNode = this.findLast()
    while(lastNode.previous !== null && (this.isCycle ? lastNode.next !== this.head : true)) {
      console.log(lastNode.element)
      lastNode = previous.previous
    }
  }
}

const two = new TwoWayLList()





// 二叉树(BST)
class Node {
  constructor(data, left, right) {
    this.data = data
    this.left = left
    this.right = right
  }

  show() {
    return this.data
  }
}

class BST {
  constructor() {
    this.root = null
  }

  insert(data) {
    const node = new Node(data, null, null)
    if(this.root === null) {
      this.root = node
    } else {
      let currentRoot = this.root

      while(true) {
        if(currentRoot.data > data) {
          if(currentRoot.left === null) {
            currentRoot.left = node
            break
          }
          currentRoot = currentRoot.left
        } else if(currentRoot.data < data) {
          if(currentRoot.right === null) {
            currentRoot.right = node
            break
          }
          currentRoot = currentRoot.right
        } else {
          break
        }
      }
    }
    return this.root
  }

  find(data, root = this.root) {
    let currentRoot = root

    while(currentRoot !== null) {
      if(currentRoot.data === data) {
        return currentRoot
      } else if(currentRoot.data > data) {
        currentRoot = currentRoot.left
      } else {
        currentRoot = currentRoot.right
      }
    }
    return null
  }

  getMIn(root = this.root) {
    const currentRoot = root

    while(currentRoot.left !== null) {
      currentRoot = currentRoot.left
    }
    return currentRoot.data
  }

  getMax(root = this.root) {
    const currentRoot = root

    while(currentRoot.right !== null) {
      currentRoot = currentRoot.right
    }
    return currentRoot.data
  }

  remove(data) {
    this.root = this.removeNode(data, this.root)
  }

  removeNode(data, root) {
    const currentRoot = root

    if(currentRoot === null) {
      return null
    }

    if(data === currentRoot.data) {
      if(currentRoot.left === null && currentRoot.right === null) {
        return null
      }
      if(currentRoot.left === null) {
        return currentRoot.right
      }
      if(currentRoot.right === null) {
        return currentRoot.left
      }

      var tempNode = this.getSmallest(currentRoot.right)
      currentRoot.data = tempNode.data
      currentRoot.right = this.removeNode(tempNode.data, currentRoot.right)
      return currentRoot
    } else if(data < currentRoot.data) {
      currentRoot.left = this.removeNode(data, currentRoot.left)
      return currentRoot
    } else if(data > currentRoot.data) {
      currentRoot.right = this.removeNode(data, currentRoot.right)
      return currentRoot
    }
  }

  getSmallest(node) {
    if (node.left == null) {
      return node
    } else {
      return getSmallest(node.left)
    }
  }

  inOrder(root = this.root) {
    if(root) {
      this.inOrder(root.left)
      console.log(root.data)
      this.inOrder(root.right)
    }
  }

  preOrder(root = this.root) {
    if(root) {
      console.log(root.data)
      this.preOrder(root.left)
      this.preOrder(root.right)
    }
  }

  postOrder(root = this.root) {
    if(root) {
      this.postOrder(root.left)
      this.postOrder(root.right)
      console.log(root.data)
    }
  }
}


var test = new BST()

test.insert(30)
test.insert(20)
test.insert(10)
test.insert(8)
test.insert(5)
test.insert(3)
test.insert(1)
test.insert(2)
test.insert(4)
test.insert(6)
test.insert(9)
test.insert(11)
