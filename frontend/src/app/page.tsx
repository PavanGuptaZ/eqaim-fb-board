"use client"
import { useEffect, useReducer, useState } from 'react';
import styles from './Home.module.scss';
import Link from 'next/link';
import Button01 from '@/components/Button01';
import iconSuggestions from '../assets/suggestions/icon-suggestions.svg';
import illustrationEmpty from '../assets/suggestions/illustration-empty.svg'
import hamburger from '../assets/shared/mobile/icon-hamburger.svg';
import closeIcon from '../assets/shared/mobile/icon-close.svg';
import Image from 'next/image';
import SortBy from '@/components/SortBy';
import { FilterTypes, SortTypes, StatusTypes } from '@/types/home';
import SuggessionBlock from '@/components/SuggessionBlock';
import { useGetUser } from '@/hooks/ContextProvider';
import { LoginAndRegister } from '@/components/LoginAndRegister/LoginAndRegister';
import { feedbackDetail, feedbackAction } from '@/types/apiElemants';
import { useGetFeedbackList, useGetFeedbackListLoading } from '@/hooks/FeedbackProvider';
import { LoadingComponent } from '@/components/LoadingComponent';

export default function Home() {
  const [filterValue, setFilterValue] = useState<FilterTypes>(FilterTypes.all)
  const [sort, setSort] = useState<SortTypes>(SortTypes.mostUpvotes)
  const [showMenu, setShowMenu] = useState(false)

  const user = useGetUser()
  const feedbackData = useGetFeedbackList()
  const feedbackLoading = useGetFeedbackListLoading()

  if (!user) {
    return <LoginAndRegister />
  }

  if (feedbackLoading) {
    return <LoadingComponent />
  }

  const filterValues: string[] = Object.values(FilterTypes)


  const handleChangeFilter = (value: FilterTypes) => {
    if (value !== filterValue) {
      setFilterValue(value)
    } else {
      setFilterValue(FilterTypes.all)
    }
  }
  const filteredList = feedbackData ? feedbackData.filter((elem) => filterValue === FilterTypes.all ? true : elem.category === filterValue) : []
  const getSortedData = () => {
    switch (sort) {
      case SortTypes.leastCommets:
        return filteredList.slice().sort((a, b) => a.comments - b.comments);
      case SortTypes.mostCommets:
        return filteredList.slice().sort((a, b) => b.comments - a.comments);
      case SortTypes.leastUpvotes:
        return filteredList.slice().sort((a, b) => a.upvotes - b.upvotes);
      case SortTypes.mostUpvotes:
        return filteredList.slice().sort((a, b) => b.upvotes - a.upvotes);
      default:
        return filteredList;
    }
  };
  const sortedList = getSortedData();

  return (
    <div className={styles.HomeBox}>
      <div className={styles.ControlBox}>
        <div className={styles.header}>
          <div className={styles.details}>
            <div className={styles.title}>Eqaim</div>
            <div className={styles.subtitle}>Feedback Board</div>
          </div>
          <div className={styles.mobileControls} onClick={() => setShowMenu(!showMenu)}>
            {!showMenu ? <Image src={hamburger} alt='hamburger' className={styles.MobileToggle} />
              : <Image src={closeIcon} alt='closeIcon' className={styles.MobileToggle} />}
          </div>
        </div>

        <div className={styles.asideOption} style={{ right: showMenu ? 0 : "-100%" }}>
          <div className={styles.sortOptions}>
            <ul className={styles.optionsList}>
              {filterValues.map((ele) => {
                return <li key={ele} className={styles.optionItem + " " + (ele === filterValue ? styles.activeOption : "")}
                  onClick={() => handleChangeFilter(ele as FilterTypes)}>{ele}</li>
              })}
            </ul>
          </div>

          <div className={styles.roadMapOptions}>
            <div className={styles.readMapHead}>
              <p>RoadMap</p>
              <Link className={styles.Link} href={'/roadmap'}>View</Link>
            </div>
            <div className={styles.roadmapList}>
              <div className={styles.roadmapItem}>
                <p className={styles.planned}></p>Planned
                <p className={styles.count}>{filteredList.filter((elem) => elem.status == StatusTypes.planning).length}</p>
              </div>
              <div className={styles.roadmapItem}>
                <p className={styles.progress}></p>In-Progress
                <p className={styles.count}>{filteredList.filter((elem) => elem.status == StatusTypes.inProgress).length}</p>
              </div>
              <div className={styles.roadmapItem}>
                <p className={styles.live}></p>Live
                <p className={styles.count}>{filteredList.filter((elem) => elem.status == StatusTypes.live).length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.SuggessionBox}>
        <div className={styles.suggessionHead}>
          <div className={styles.leftAlineItems}>
            <Image src={iconSuggestions} alt='iconSuggestions' className={styles.mobileHidden} />
            <div className={styles.SuggestionsTitle + " " + styles.mobileHidden}>{filteredList.length} Suggestions</div>
            <SortBy sort={sort} setSort={setSort} />
          </div>
          <Button01 text='+ AddFeadBack' type='type01' BTNtype={'route'} routeLink="newfeedback" />
        </div>

        <div className={styles.list}>
          {sortedList.length > 0
            ?
            sortedList.map((elem) => {
              return <SuggessionBlock key={elem.id} data={elem} isLiked={false} hoverEffect={true} />
            })
            :
            <div className={styles.emptyList}>
              <div><Image src={illustrationEmpty} alt='illustrationEmpty' /></div>
              <div className={styles.title}>There is no feedback yet.</div>
              <div className={styles.text}>Got a suggestion? Found a bug that needs to be squashed? We love hearing about new ideas to improve our app.</div>
              <Button01 text='+ AddFeadBack' type='type01' BTNtype={'route'} routeLink="newfeedback" />
            </div>
          }
        </div>

        {showMenu && <div className={styles.backCover} onClick={() => setShowMenu(false)}></div>}

      </div>
    </div>
  )
}

export function feedbackReducer(state: feedbackDetail[] | null, action: feedbackAction) {

  switch (action.type) {
    case "addFeedback":
      return action.payload || null
    case "removeFeedback":
      return null
    default:
      return state;
  }
}