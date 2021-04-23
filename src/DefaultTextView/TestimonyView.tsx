import { Testimony } from '../bookofmormon'
import React, {FunctionComponent} from 'react'

type TestimonyViewProps = {
    testimony: Testimony
}

const TestimonyView: FunctionComponent<TestimonyViewProps> = ({ testimony }) => {
    return <div>
        <h1 className="TestimonyTitle">{testimony.title}</h1>
        <div className="TestimonyText">{testimony.text}</div>
        {
            testimony.witnesses.map(witness => (
                <div className="TestimonyWitness">{witness}</div>
            ))
        }
    </div>
}

export default TestimonyView