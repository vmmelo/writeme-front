import React from 'react';
import PropTypes from 'prop-types';
import './Composer.css';
import ReactGA from 'react-ga';
import About from '../About/About';
import SuggestionsContainer from './SuggestionsContainer/SuggestionsContainer';
import READMEContainer from './READMEContainer/READMEContainer';
import isEqual from '../../common/Extensions';
import { alertError, alertInfo } from '../../common/alerts';
import Loading from '../../common/loading.jsx';

class Composer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSections: [],
      sectionsLoaded: false,
      treesLoaded: false,
      sections: [],
      trees: {},
    };
    this.ref = React.createRef();
    const { match: { params: { language } } } = props;
    ReactGA.pageview(`composer/${language}`);
  }

  componentDidMount() {
    const { match: { params: { language } } } = this.props;
    fetch(`${process.env.REACT_APP_BACKEND_URL}files/trees/${language}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            treesLoaded: true,
            trees: result,
          });
        },
        (error) => {
          alertInfo('Language not processed yet', 'Please, try again in a few minutes (≈ 15 min) while the language is been processed.');
          console.error(error);
          this.setState({
            treesLoaded: true,
            trees: {},
          });
        },
      );

    fetch(`${process.env.REACT_APP_BACKEND_URL}files/sections/${language}`)
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            sectionsLoaded: true,
            sections: result,
          });
        },
        (error) => {
          console.error(error);
          alertInfo('Language not processed yet', 'Please, try again in a few minutes (≈ 15 min) while the language is been processed.');
          this.setState({
            sectionsLoaded: true,
            sections: [],
          });
        },
      );

    fetch(`${process.env.REACT_APP_BACKEND_URL}${language}`)
      .then(res => res.body)
      .then(
        () => {},
        (error) => {
          console.error(error);
          alertError(false, 'Could not connect to WRITEME server');
        },
      );
  }

  sectionIndex(section) {
    const { selectedSections } = this.state;
    return selectedSections.findIndex(selectedSection => isEqual(section, selectedSection));
  }

  toggleSection(toggledSection) {
    const { selectedSections } = this.state;
    const sectionIndex = this.sectionIndex(toggledSection);

    if (sectionIndex === -1) {
      selectedSections.push(toggledSection);
    } else {
      selectedSections.splice(sectionIndex, 1);
    }

    this.setState({
      selectedSections,
    });
  }

  render() {
    const {
      selectedSections, trees, sections, sectionsLoaded, treesLoaded,
    } = this.state;
    const { match: { params: { language } } } = this.props;
    const loading = !sectionsLoaded || !treesLoaded;
    const numRepos = Object.keys(trees).length;

    return (
      <div key={this.ref}>
        <About numRepos={`${numRepos}`} />
        <Loading hide={!loading} className="Composer" />
        {!loading && (
        <div className="Composer">
          <SuggestionsContainer
            sections={sections}
            trees={trees}
            language={language}
            onSectionToggle={section => this.toggleSection(section)}
          />
          <READMEContainer selectedSections={selectedSections} />
        </div>
        )}
      </div>
    );
  }
}

Composer.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      language: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default Composer;
