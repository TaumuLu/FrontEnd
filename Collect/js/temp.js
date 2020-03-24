class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  parent() {
    return 'parent';
  }
}


class ColorPoint extends Point {
  constructor(x, y, color) {
    // 调用父类的constructor(x, y)
    super(x, y);
    this.color = color;
  }

  toString() {
    // 调用父类的toString()
    return this.color + ' ' + super.toString();
  }
}


function scheduler(task) {
  var taskObj = task.next(task.value);
  // 如果Generator函数未结束，就继续调用
  if (!taskObj.done) {
    task.value = taskObj.value;
    scheduler(task);
  }
}
scheduler(longRunningTask(initialValue));


// 下面是二叉树的构造函数，
// 三个参数分别是左树、当前节点和右树
function Tree(left, label, right) {
  this.left = left;
  this.label = label;
  this.right = right;
}

// 下面是中序（inorder）遍历函数。
// 由于返回的是一个遍历器，所以要用generator函数。
// 函数体内采用递归算法，所以左树和右树要用yield*遍历
function* inorder(t) {
  if (t) {
    yield* inorder(t.left);
    yield t.label;
    yield* inorder(t.right);
  }
}

// 下面生成二叉树
function make(array) {
  // 判断是否为叶节点
  if (array.length == 1) return new Tree(null, array[0], null);
  return new Tree(make(array[0]), array[1], make(array[2]));
}
let tree = make([
  [
    ['a'], 'b', ['c'],
  ], 'd', [
    ['e'], 'f', ['g'],
  ],
]);

// 遍历二叉树
var result = [];
for (let node of inorder(tree)) {
  result.push(node);
}

result;
// ['a', 'b', 'c', 'd', 'e', 'f', 'g']



function* F() {
  this.a = 1;
  yield this.b = 2;
  yield this.c = 3;
}
var obj = {};
var f = F.call(obj);

f.next(); // Object {value: 2, done: false}
f.next(); // Object {value: 3, done: false}
f.next(); // Object {value: undefined, done: true}

obj.a; // 1
obj.b; // 2
obj.c; // 3


scheduler(longRunningTask(initialValue));

function scheduler(task) {
  var taskObj = task.next(task.value);
  // 如果Generator函数未结束，就继续调用
  if (!taskObj.done) {
    task.value = taskObj.value;
    scheduler(task);
  }
}



var fetch = function(url) {
  return new Promise(function(resolve, reject) {
    ajax(url, resolve, reject);
  });
};

async function main() {
  try {
    var arrValue = await Promise.all[fetch('url1'), fetch('url2')];
    conosle.log(arrValue[0], arrValue[1]);
  } catch (err) {
    console.error(err);
  }
}
main();


let formData = new FormData();
formData.append('addressId', 370200);
formData.append('skuId', 6568);
formData.append('quantity', 1);

let data = 'addressId=370200&skuId=6568&quantity=1';

fetch('http://hisense.terminus.io/api/hisense/carts', {
  method: 'POST',
  credentials: "include",
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
  body: data,
}).then((response)=>response.json())
  .then((res) => console.log(res));


// enum
// interface
// class


// public
// private
// protected
// default


// public class HelloWorld {
//   public static void main(String[] args) {
//     // 保存累加值
//     int sum = 0;
//     // 从1循环到10
//     for (int i = 1; i <= 10; i++) {
//       // 每次循环时累加求和
//       sum = sum + i;
//       // 判断累加值是否大于20，如果满足条件则退出循环
//       if (sum > 20) {
//         System.out.print("当前的累加值为:" + sum);
//         //退出循环
//         break;
//       }
//     }
//   }
//   public static ArrayList Func(int[] arr, double[] arr2) {}
//   private static void func() {}
//   protected
// }




