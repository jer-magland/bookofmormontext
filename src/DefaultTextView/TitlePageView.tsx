import { TitlePage } from '../bookofmormon'
import React, {FunctionComponent} from 'react'


type TitlePageViewProps = {
    titlePage: TitlePage
}

const TitlePageView: FunctionComponent<TitlePageViewProps> = ({ titlePage }) => {
    return <div style={{paddingLeft: 6, paddingRight: 6}}>
        <h1 className="TitlePageTitle">{titlePage.title}</h1>
        <div className="TitlePageSubtitle">{titlePage.subtitle}</div>
        {
            titlePage.text.map((txt, i) => (
                <div key={i} className="TitlePageText">{txt}</div>
            ))
        }
    </div>
}

export default TitlePageView