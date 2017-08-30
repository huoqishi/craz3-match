/**
 * 爱消除游戏核心代码
 */
var arr = ['#bc3329', '#346cbe', '#41c361', '#bfbe4e', '#4fb5bf', '#be7c4a', '#000']
var width = 50
// 生成 countX * countY个div,每个编号，表明共几行几列
var countX = 7
var countY = 7
var sum = 0 // 标记消除了多少组
var $ = document.querySelector.bind(document)
/**
 * 初始化div
 */
function initDiv () {
  for (var x = 0; x < countX; x++) {
    for (var y = 0; y < countY; y++) {
      createElement(x, y)
    }
  }
  carz3Match()
}

/**
 * 生成一个独立的div, div的位置由参数x,y决定,
 * @param  {number} x 指定div的位置left
 * @param  {[type]} y 指定div的位置top
 */
function createElement (x, y) {
  var oDiv = document.createElement('div')
  var index = Math.ceil(Math.random() * 6)
  oDiv.dataset.index = index // 标记元素类型，方便消除时判断
  oDiv.dataset.x = x // 用于标记元素是第几列
  oDiv.dataset.y = y // 用于标记元素是第几行
  oDiv.style.left = (x * width) + 'px'
  oDiv.style.top = (y * width) + 'px'
  oDiv.classList.add('game-item') // 需要设置好.game-item {position:absolute}
  oDiv.innerHTML = index
  oDiv.style.backgroundColor = arr[index]
  // oDiv.onclick = function () {alert(88)}
  drapItem(oDiv)
  $('.game-box').appendChild(oDiv)
}

/**
 * 清除相邻三个完全相同的元互! 横竖都判断
 */
function carz3Match () {
  var oBox = $('.game-box')
  var count = 0
  // 遍历所有行和列
  for (var x = 0; x < countX; x++) {
    for (var y = 0; y < countY; y++) {
      // 当前元素
      var itemNow = $('[data-x="' + x + '"][data-y="' + y + '"]')

      // 判断只有当元素不是左边第一个，或者不是右边最后一个时才进行处理
      if (x > 0 && x < countX - 1) {
        // 左边的元素
        var itemLeft = $('[data-x="' + (x - 1) + '"][data-y="' + y + '"]')
        var itemRight = $('[data-x="' + (x + 1) + '"][data-y="' + y + '"]')
        console.log(x,y)
        if (itemLeft&&itemRight&&itemNow.dataset.index === itemLeft.dataset.index && itemNow.dataset.index === itemRight.dataset.index) {
           count += 1
           // 清除三个元素
           oBox.removeChild(itemNow)
           oBox.removeChild(itemLeft)
           oBox.removeChild(itemRight)
        }
        continue
      }
      // 判断只有当元素不是上边第一个，或者不是下边最后一个时才进行处理
      if (y > 0 && y < countY - 1) {
        var itemUp = $('[data-x="' + x + '"][data-y="' + (y - 1) + '"]')
        var itemDown = $('[data-x="' + x + '"][data-y="' + (y + 1) + '"]')
        continue
      }
    }
  }
  // 如果消除了至少一组元素，则需要调用repaire修复一下
  if (count > 0) {
    repaire()
  }
}

/**
 * 判断如果该行没有元素，则让上一行下降!, 递归调用!
 * 如果第一行缺少元素，则随机生成一个，补上！
 *  * @return {boolean} 
 */
function repaire () {
  console.log(1)
  var hasRepaired = false // 标记本次调用有没有要被补充的元素,false表示没有
  for (var x = 0; x < countX; x++) {
    for (var y = 0; y < countY; y++) {
      var selector = '[data-x="' + x + '"][data-y="' + y + '"]'
      var item = $(selector)
      if (item) {continue}
      if (x < countX) {
        createElement(x, y)
        continue
      }
      items[i].dataset.y = items[i].dataset.y - 0 + 1
      items[i].style.top = items[i].dataset.y * width + 'px'
      hasRepaired = true
    }
  }
  if (hasRepaired) {
    repaire()
  }

  // 修复之后要调用craz3Match() 以确保, 修复后的元素中没有3个相联的!
  carz3Match()
  // const result = carz3Match()
  // if (result)

}

/**
 * 
 * 判断如果该行没有元素，则让上一行下降!
 * 如果第一行缺少元素，则随机生成一个，补上
 * 
 * @return {[type]} [description]
 */
function down () {
  var items = document.querySelectorAll('.game-item')
  var count = 0
  for (var i = 0; i < items.length; i++) {
    if (items[i].dataset.y === '0') { continue }

    // 获取
    var qs = '[data-x="' + items[i].dataset.x + '"][data-y="' + (items[i].dataset.y - 0 + 1) + '"]'
    var tmp = $(qs)

    // 如果没有这个元素，则表明，被删除了，则当当前元素下降!
    if (!tmp) {
      items[i].dataset.y = items[i].dataset.y - 0 + 1
      items[i].style.top = items[i].dataset.y * width + 'px'
      count++
    }
  }
  if (count > 0) {
    down()
  }
}

/**
 * 给元素注册鼠标事件，拖动到某个元素上时，交换位置
 */
function drapItem (item) {
   // console.log(item)
   var startX = 0
   var startY = 0
   var offsetX = 0 // 手指x方向偏移值
   var offsetY = 0
   var x = 0 // 元素的data-x 属性值
   var y = 0
   var initDirection // 表示初始方向
   // 表示实例方向
   var direction = {
      isMove: false, // 表示是否移动过
      horizontal: false,
      vertical: false,
      left: false,
      right: false,
      up: false,
      down: false,
   }
   item.addEventListener('touchstart', function (e) {
     e.preventDefault()
     var touch = e.touches[0]
     // 保存初始手指位置
     startX = touch.pageX
     startY = touch.pageY
     // 获取元素data-x值
     x = item.dataset.x - 0
     y = item.dataset.y - 0

     // 添加active样式，用于突出显示当前拖动的元素
     item.classList.add('active')

     direction.isMove = false // 标记当前元素的touchstart触发后,toucmove事件还没触发
   }, false)
   item.addEventListener('touchmove', function (e) {
     // 重置方向
     for (key in direction) {
      direction[key] = false
     }
     direction.isMove = true
     console.log('moving..')
     // 计算手指位移
     var touch = e.touches[0]
     offsetX = touch.pageX - startX
     offsetY = touch.pageY - startY


     // 限制最大移动距离
     offsetX = Math.abs(offsetX) > width ? Math.abs(offsetX) / offsetX * width : offsetX
     offsetY = Math.abs(offsetY) > width ? Math.abs(offsetY) / offsetY * width : offsetY

     // 限制不允许移出边界
     offsetX = offsetX + x * width > (countX - 1) * width ||  offsetX + x * width < 0 
     ? 0 : offsetX
     offsetY = offsetY + y * width > (countY - 1) * width ||  offsetY + y * width < 0 
    ? 0 : offsetY

     // 判断初始方向,只判断一次
     if (!initDirection) {
       if (Math.abs(offsetX) > Math.abs(offsetY)) {
         initDirection = 'horizontal'
       } else {
         initDirection = 'vertical'
       }
     }

     // 判断实时方向
     // 判断整体是垂直还是水平
     if (Math.abs(offsetX) > Math.abs(offsetY)) {
        direction.horizontal = true
        // 判断往左还是往右
        if (offsetX > 0) {
          direction.right = true
        } else {
          direction.left = true
        }
     } else {
        direction.vertical = true
        // 判断往上还是往下
        if (offsetY > 0) {
          direction.down = true
        } else {
          direction.up = true
        }
     }
     switch (initDirection) {
       case 'horizontal': // 水平
       // 如果是水平方向拖动，则只改变left
       // 计算元素新位置
       item.style.left = (x * width + offsetX) + 'px'
       return
       case 'vertical': // 垂直
       // 如果是垂直方向拖动，则只改变top
       item.style.top = (y * width + offsetY) + 'px'
       return
     }
   }, false)
   item.addEventListener('touchend', function () {
    console.log(direction.isMove)
    if (direction.isMove) {
      exchangeItem(item, direction, offsetX, offsetY)
    }
     initDirection = undefined
     item.classList.remove('active')
   }, false)
}

/**
 * 在touchend时调用，用于交换两个元素
 * 参数当前拖动的元素
 */
function exchangeItem (item, direction, offsetX, offsetY) {
  console.log(direction)
  // 如果没有移动过，则退出不执行
  if (!direction.horizontal && !direction.vertical) {
    console.log('没有移动')
    return
  }
  var x = item.dataset.x - 0
  var y = item.dataset.y - 0
  var targetX // 目标元素的data-x
  var targetY //
  // 如果移动距离太小，则不交换
  if (direction.horizontal && Math.abs(offsetX) < width / 2 || direction.vertical && Math.abs(offsetY) < width / 2) {
    item.style.left = x * width + 'px'
    item.style.top = y * width + 'px'
    console.log('移动距离太小，不交换')
    return
  }
  if (direction.horizontal) {
    targetY = y
  } else {
    targetX = x
  }
  if (direction.left) {
    if (x === 0) {
      return
    }
    targetX = x - 1
  }
  if (direction.right) {
    if (x >= countX) {
      return
    }
    targetX = x + 1
  }
  if (direction.up) {
    if (y === 0) {
      return
    }
    targetY = y - 1
  }
  if (direction.down) {
    if (y >= countY) {
      return
    }
    targetY = y + 1
  }
  window.item = item
  console.log(x,y, targetX, targetY)

  // 获取目标元素，及交换位置,交换 data-x,data-y的值
  var target = $('[data-x="' + targetX + '"][data-y="' + targetY + '"]')
  tempExchange(item, targetX, targetY)
  tempExchange(target, x, y)
  function tempExchange (item, x, y) {
    item.style.left = (x * width) + 'px'
    item.style.top = (y * width) + 'px'
    item.dataset.x = x
    item.dataset.y = y
          
  }

  // 交换之后调用carz3Match
  carz3Match()
}

// 2, 3 与 2, 4

initDiv()
