import React from 'react'


export const useOutsideAlerter = (initialValue: boolean) => {

  const ref = React.useRef<HTMLDivElement>(null)
  const [visible, setVisible] = React.useState<boolean>(initialValue)
  const handleClickOutside = (event: any) => {
    console.log(event.target)
    if (ref.current && !ref.current.contains(event.target)) {
      setVisible(false)
    }

  }

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)

    }
  }, [ref])


  return {
    ref, visible, setVisible
  }
}