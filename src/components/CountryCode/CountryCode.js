import React, { useState, useEffect, useMemo } from 'react' //  { useState, useContext, useCallback, useEffect } // ,
import ReactDOM from 'react-dom'
import styles from './CountryCode.module.scss'
import { ReactComponent as CloseBtn } from './icDrawerCloseDark.svg'
import { ReactComponent as IcSearchMagnifier } from './icSearchMagnifier.svg'

import { countryData } from './test'

const CountryCodeModal = ({
  title = '國家/地區代碼',
  children,
  openClick = () => {},
  open = false
}) => {
  return open ? (
    <div className={styles.bg}>
      <div className={styles.wrapper}>
        <div className={styles.modalWrapper}>
          <div className={styles.headingBlock}>
            <div className={styles.headingTitle}>{title}</div>
            <CloseBtn
              className={styles.closeBtn}
              onClick={() => openClick(false)}
            />
          </div>
          <div className={styles.countryCodeWrapper}>{children}</div>
        </div>
      </div>
    </div>
  ) : null
}

const Country =
  //  useMemo(
  (props) => {
    const { isClick, country, callBackCountry = () => {} } = props

    return (
      <div
        className={`${styles.country} `}
        onClick={() => callBackCountry(country)}
      >
        <div
          className={`${styles.countryZhName} ${
            isClick && styles.countryZhNameChecked
          }`}
        >
          {`${country.zhName}（＋${country.code}）`}
        </div>
        <div className={styles.countryEnName}>{country.enName}</div>
      </div>
    )
  }
// )

const CountryCodeContent = (props) => {
  console.log('CountryCodeContent', props)
  const {
    openClick = () => {},
    countryCallBack = () => {},
    choseCountryCode
  } = props
  const alpha = Array.from(Array(26)).map((e, i) => i + 65)
  const alphabet = alpha.map((x) => String.fromCharCode(x))
  /** if hot key add '#' */
  const { hot, list } = countryData
  if (hot) alphabet.unshift('#')

  /** set CountryCodeIndex State */
  const [countryCodeIndex, setCountryCodeIndex] = useState(hot ? '#' : 'A')

  /** set countryId State: default 92(TW) */
  const [activeCountry, setActiveCountry] = useState(choseCountryCode)

  /** set searchingData State: '') */
  const [searchingData, setSearchingData] = useState('')

  const changeCountryCodeIndex = (index) => {
    setCountryCodeIndex(index)
  }

  const changeCountryCodeChecked = (country) => {
    setActiveCountry(country.id)
    countryCallBack(country)
    openClick(false)
  }

  const typingCode = (e) => setSearchingData(e.target.value)

  return (
    <div id='countryCodeWrapper' className={styles.countryCodeContent}>
      <div className={styles.TopContent}>
        <div className={styles.noticeText}>
          非台灣號碼無法接收簡訊我們將以Email與您聯繫
        </div>
        <div className={styles.inputSearch}>
          <IcSearchMagnifier />
          <input
            placeholder={'搜尋國家/地區代碼'}
            value={searchingData}
            onChange={(e) => typingCode(e)}
          />
        </div>
      </div>
      <div className={styles.codeListWrapper}>
        <div className={styles.indexListWrapper}>
          <div className={styles.indexList}>
            {searchingData.length > 0
              ? null
              : alphabet.map((item, index) => (
                  <a
                    key={index}
                    className={`${styles.indexItem} ${
                      countryCodeIndex === item && styles.indexItemChecked
                    }`}
                    href={'#' + item}
                    onClick={() => changeCountryCodeIndex(item)}
                  >
                    {item}
                  </a>
                ))}
          </div>
        </div>
        <div className={styles.codeLists}>
          {searchingData.length > 0 ? (
            <div className={styles.countries}>
              {list.map((country) => {
                const enNameLowerCase = country.enName.toLowerCase()
                const searchingDataLowerCase = searchingData.toLowerCase()
                return (
                  (country.zhName.indexOf(searchingData) > -1 ||
                    enNameLowerCase.indexOf(searchingDataLowerCase) > -1 ||
                    country.code.indexOf(searchingData) > -1) && (
                    <Country
                      key={country.enName}
                      country={country}
                      callBackCountry={changeCountryCodeChecked}
                      isClick={country.id === activeCountry.id}
                    />
                  )
                )
              })}
            </div>
          ) : (
            alphabet.map((alphabetItem) => {
              return (
                <div
                  id={alphabetItem}
                  key={'index_' + alphabetItem}
                  className={styles.indexArea}
                >
                  <div className={styles.indexTitle}>
                    {alphabetItem === '#' ? '常用國家/地區' : alphabetItem}
                  </div>
                  <div className={styles.countries}>
                    {alphabetItem === '#'
                      ? hot.map((country) => (
                          <Country
                            key={country.enName}
                            country={country}
                            callBackCountry={changeCountryCodeChecked}
                            isClick={country.id === activeCountry.id}
                          />
                        ))
                      : list.map((country) => {
                          return (
                            country.firstLetter === alphabetItem && (
                              <Country
                                key={country.enName}
                                country={country}
                                callBackCountry={changeCountryCodeChecked}
                                isClick={country.id === activeCountry.id}
                              />
                            )
                          )
                        })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}

const CountryCode = (props) => {
  const {
    apiCallbackSuccess,
    apiBase = 'https://static-test.cdn-eztravel.com/m/api'
  } = props
  const [APIData, setAPIData] = useState([])

  useEffect(() => {
    const url = apiBase + '/mobileCountryCode.json'

    const fetchData = async () => {
      try {
        const response = await fetch(url)
        console.log(url)
        const json = await response.json()
        if (json) {
          setAPIData(json)
          apiCallbackSuccess(true)
        }
        console.log(json)
      } catch (error) {
        console.log('error', error)
      }
    }

    const timer = setTimeout(() => {
      fetchData()
    }, 2000)
  }, [])

  console.log('CountryCode', props)
  return ReactDOM.createPortal(
    <CountryCodeModal
      children={<CountryCodeContent {...props} countryCodesData={APIData} />}
      {...props}
    />,
    document.body
  )
}

export default CountryCode
