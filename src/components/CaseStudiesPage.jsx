import { Link } from 'react-router-dom';
import './CaseStudiesPage.css';

const caseStudies = [
  {
    id: 'f-vs-q',
    title: 'F vs. q on 10×10 Grid',
    description: 'How do the number of cultural features and trait values affect consensus? We explore the phase transitions between cultural homogeneity and fragmentation.',
    image: '/case-studies/heatmap_global_consensus.png',
    date: 'January 2025',
    readTime: '8 min read',
    tags: ['Consensus', 'Parameter Study', 'Phase Transitions']
  }
  // Add more case studies here in the future
];

function CaseStudiesPage() {
  return (
    <main className="math-content">
      <div className="math-section">
        <h2 className="math-heading">Case Studies</h2>
        <p className="math-text case-studies-intro">
          Explore in-depth analyses of cultural dynamics through systematic parameter exploration and simulation experiments.
        </p>

        <div className="case-studies-grid">
          {caseStudies.map((study) => (
            <Link
              key={study.id}
              to={`/case-studies/${study.id}`}
              className="case-study-card"
            >
              <div className="case-study-image-wrapper">
                <img
                  src={study.image}
                  alt={study.title}
                  className="case-study-image"
                />
                <div className="case-study-overlay">
                  <span className="case-study-read-more">Read Article →</span>
                </div>
              </div>
              <div className="case-study-content">
                <div className="case-study-tags">
                  {study.tags.map((tag, index) => (
                    <span key={index} className="case-study-tag">{tag}</span>
                  ))}
                </div>
                <h3 className="case-study-title">{study.title}</h3>
                <p className="case-study-description">{study.description}</p>
                <div className="case-study-meta">
                  <span className="case-study-date">{study.date}</span>
                  <span className="case-study-dot">•</span>
                  <span className="case-study-time">{study.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

export default CaseStudiesPage;
