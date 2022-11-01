import React, { useState } from 'react'
import { CountryCode } from 'test-library-react'
import styles from './styles.module.scss'

import 'test-library-react/dist/index.css'
import { ReactComponent as IcArrowDownMiddle } from './icArrowDownMiddle.svg'

const ExampleComponent = () => {
  const [openCountryCode, setOpenCountryCode] = useState(false)
  const [choseCountryCode, setChoseCountryCode] = useState({
    code: '886',
    enName: 'Taiwan',
    firstLetter: 'T',
    id: 92,
    shortName: 'TW',
    zhName: '台灣'
  })
  const [apiSuccess, SetApiSuccess] = useState(false)

  const openClick = (isOpen) => setOpenCountryCode(isOpen)
  /** if API back ,then show icon IcArrowDownMiddle */
  const apiCallbackSuccess = (isSuccess) => SetApiSuccess(isSuccess)

  const countryCallBack = (data) => setChoseCountryCode(data)

  return (
    <div className={styles.field}>
      <div className={styles.fieldName}>聯絡電話</div>
      <div
        className={styles.countryCode}
        onClick={() => apiSuccess && setOpenCountryCode(true)}
      >
        +{choseCountryCode.code}
        {apiSuccess && (
          <IcArrowDownMiddle className={styles.IcArrowDownMiddle} />
        )}
      </div>
      <CountryCode
        open={openCountryCode}
        openClick={openClick}
        choseCountryCode={choseCountryCode}
        apiCallbackSuccess={apiCallbackSuccess}
        countryCallBack={countryCallBack}
        apiBase={'https://static-test.cdn-eztravel.com/m/api'}
      />
    </div>
  )
}

const App = () => {
  return <ExampleComponent />
}

export default App
