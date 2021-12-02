import React from 'react'
import { Children } from 'types'

type Props = Children & { unmountAfter?: number }

const Mounter = ({ children, unmountAfter }: Props) => {
  const [shouldMount, setShouldMount] = React.useState(true)

  React.useEffect(() => {
    if (unmountAfter) {
      setTimeout(() => {
        setShouldMount(false)
      }, unmountAfter)
    }
  }, [unmountAfter])

  if (shouldMount) return <>{children}</>

  return null
}

export default Mounter
