// 冒泡排序
function bubbleSort(arr) {
    var i = arr.length,
        j;
    var tempExchangVal;
    while (i > 0) {
        for (j = 0; j < i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                tempExchangVal = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = tempExchangVal;
            }
        }
        i--;
    }
    return arr;
}



// 快速排序
function quickSort(array) {
    function sort(prev, numsize) {
        var nonius = prev;
        var j = numsize - 1;
        var flag = array[prev];
        if ((numsize - prev) > 1) {
            while (nonius < j) {
                for (; nonius < j; j--) {
                    if (array[j] < flag) {
                        array[nonius++] = array[j];　 //a[i] = a[j]; i += 1;
                        break;
                    }
                }
                for (; nonius < j; nonius++) {
                    if (array[nonius] > flag) {
                        array[j--] = array[nonius];
                        break;
                    }
                }
            }
            array[nonius] = flag;
            sort(0, nonius);
            sort(nonius + 1, numsize);
        }
    }
    sort(0, array.length);
    return array;
}

function quickSort() {
    //确定哨兵, 递归分离
    function quickSortHelper(arr, start, end) {
        if (start < end) { //快排结束条件start>=end
            //获取哨兵的位置
            var part = partation(arr, start, end);

            //根据递归实现排序
            arguments.callee(arr, start, part - 1);
            arguments.callee(arr, part + 1, end);
        }
    }

    function partation(arr, start, end) {
        var pivot = arr[end]; //设置哨兵
        var i = start; //交换的次数+1 哨兵要在数组插入的位置
        for (var j = start; j < end; j++) {
            if (arr[j] < pivot) {
                swap(arr, i, j);
                i++;
            }
        }
        swap(arr, i, end);
        return i;
    }

    //交换数组元素的值
    function swap(arr, i, j) {
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }

    quickSortHelper(this, 0, this.length - 1);
}



var a = [2, 4, 5, 63, 4, 5, 63, 2, 4, 43];
var num = 1;

function quicksort(arr) {
    num++;
    // 递归停止条件
    if (arr.length  <= 1)
        return arr;

    // 选取基准值
    var pivotIndex = Math.ceil(arr.length / 2);
    var pivot = arr.splice(pivotIndex, 1)[0]; // 基准值
    var left = [],
        right = [];

    // 如果大于基准值，移到数组right中；小于基准的值，移到数组left中
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }

    return quicksort(left).concat(pivot, quicksort(right));
}

console.log(quicksort(a));
