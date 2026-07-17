import { Reveal, Fade, CountUp } from './ui';

export default function Stats() {
  return (
    <section className="st st-light-s st-section" style={{ paddingTop: 'clamp(2rem, 5vh, 4rem)' }}>
      <Reveal className="st-wrap">
        <div className="st-stats">
          <Fade i={0} className="st-stat" style={{ ['--i' as any]: 0 }}>
            <div className="v"><CountUp to={27} suffix="+" /></div>
            <div className="l">Years in real estate</div>
          </Fade>
          <Fade i={1} className="st-stat" style={{ ['--i' as any]: 1 }}>
            <div className="v">Top 1%</div>
            <div className="l">Producer, statewide</div>
          </Fade>
          <Fade i={2} className="st-stat" style={{ ['--i' as any]: 2 }}>
            <div className="v"><CountUp to={3} /></div>
            <div className="l">States licensed — AZ · FL · NJ</div>
          </Fade>
          <Fade i={3} className="st-stat" style={{ ['--i' as any]: 3 }}>
            <div className="v"><CountUp to={10} /></div>
            <div className="l">Residences in the collection</div>
          </Fade>
        </div>
      </Reveal>
    </section>
  );
}
