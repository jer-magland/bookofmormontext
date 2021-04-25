import { Testimony } from '../bookofmormon'
import React, {FunctionComponent} from 'react'

type TestimonyViewProps = {
    testimony: Testimony
}

const TestimonyView: FunctionComponent<TestimonyViewProps> = ({ testimony }) => {
    return <div style={{paddingLeft: 6, paddingRight: 6}}>
        <h1 className="TestimonyTitle">{testimony.title}</h1>
        <div className="TestimonyText">{testimony.text}</div>
        {
            testimony.witnesses.map((witness, i) => (
                <div key={i} className="TestimonyWitness">{witness}</div>
            ))
        }
    </div>
}

export default TestimonyView