import { useRef, useState } from 'react'

export default function HexWindow({ title, children, onClose, onFocus }) { //We create a function called HexWindow that takes in props for title, children, onClose, and onFocus.
  const ref = useRef(null) //We create a ref called ref that will be used to reference the DOM element of the window. A ref is a way to store a mutable value that does not cause a re-render when it changes. We initialize it to null.  
  const [pos, setPos] = useState({ x: 120, y: 80 }) // We create a state variable called pos that will store the current position of the window. We initialize it to { x: 120, y: 80 }, which means the window will start at 120 pixels from the left and 80 pixels from the top of the screen. We also create a function called setPos that will be used to update the pos state. UseState is a way to store information that can change over time and cause the component to re-render when it does. In this case, we will use pos to keep track of where the window is on the screen, and when we update it, the window will move to the new position.
  const [size, setSize] = useState({ w: 420, h: 360 }) // Here we define the widht and height of the window.
  const dragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 }) 

  function onMouseDown(e) { //We create a function called onMouseDown that will be called when the user clicks on the title bar of the window. This function will start the dragging process. It takes in an event object e. 
    dragging.current = true
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }// We set dragging.current to true, which means we are now dragging the window. We also set dragStart.current to the difference between the mouse position (e.clientX and e.clientY) and the current position of the window (pos.x and pos.y). This will allow us to calculate how much the mouse has moved relative to the window's position when we move it. Which we do because we want the window to follow the mouse cursor as we drag it, but we also want to maintain the initial offset between the cursor and the window's top-left corner. By storing this offset in dragStart.current, we can ensure that the window moves smoothly with the cursor without jumping to a different position when we start dragging.
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }
  function onMouseMove(e) {
    if (!dragging.current) return
    setPos({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y })
  }
  function onMouseUp() {
    dragging.current = false
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  // simple resize handler on bottom-right corner
  function onResizeMouseDown(e) {
    e.stopPropagation()
    onFocus?.()
    const start = { x: e.clientX, y: e.clientY, w: size.w, h: size.h }
    function move(ev) {
      setSize({ w: Math.max(220, start.w + (ev.clientX - start.x)), h: Math.max(160, start.h + (ev.clientY - start.y)) })
    }
    function up() {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  return (
    <div
      ref={ref}
      className="hex-window"
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)`, width: size.w, height: size.h }}
    >
      <div className="hex-frame">
        <div className="hex-titlebar" onMouseDown={onMouseDown}>
          <span className="hex-title">{title}</span>
          <button
            className="hex-close"
            onClick={(e) => {
              e.stopPropagation()
              onClose()
            }}
          >
            ✕
          </button>
        </div>
        <div className="hex-content">{children}</div>
        <div className="hex-resize" onMouseDown={onResizeMouseDown} />
      </div>
    </div>
  )
}
