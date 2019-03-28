import {useState, useEffect, useCallback, useRef} from 'react'
import emptyArr from 'empty/array'
import emptyObj from 'empty/object'
import {requestTimeout, clearRequestTimeout} from '@render-props/utils'
import useWindowScroll from '@react-hook/window-scroll'
import useWindowSize from '@react-hook/window-size'


const defaultSizeOpt = {wait: 120}
const defaultScrollFps = 8

export default (initialWidth, initialHeight, opt = emptyObj) => {
  const fps = opt.scroll?.fps || defaultScrollFps
  const scrollY = useWindowScroll(fps)
  const [width, height] = useWindowSize(
    initialWidth,
    initialHeight,
    opt.size || defaultSizeOpt
  )
  const [isScrolling, setIsScrolling] = useState(false)
  const isScrollingTimeout = useRef(null)
  const unsetIsScrolling  = useCallback(
    () => {
      setIsScrolling(false)
      isScrollingTimeout.current = null
    },
    emptyArr
  )

  useEffect(
    () => {
      if (isScrolling === false && scrollY > 0) {
        setIsScrolling(true)
      }

      if (isScrollingTimeout.current !== null) {
        clearRequestTimeout(isScrollingTimeout.current)
        isScrollingTimeout.current = null
      }

      isScrollingTimeout.current = requestTimeout(unsetIsScrolling, 160)
      return () =>
        isScrollingTimeout.current !== null && clearRequestTimeout(isScrollingTimeout.current)
    },
    [scrollY]
  )

  return {width, height, scrollY, isScrolling}
}
