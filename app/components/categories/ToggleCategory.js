import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Button } from 'react-bootstrap';
import Loading from '../Loading';
import { relayStore } from '../../clientStores';
import Category from './Category';

export default class ToggleCategory extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      data: null,
    };

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });

    if (!this.state.data) {
      const query = Relay.createQuery(
        Relay.QL`query {
          viewer {
            category(filter: $filter) {
              ${Category.getFragment('category')}
            }
          }
        }`,
        { filter: { categoryID: this.props.id } }
      );
      relayStore.primeCache({ query }, readyState => {
        if (readyState.done) {
          const data = relayStore.readQuery(query)[0];
          this.setState({ data: data.category });
        }
      });
    }
  }

  render() {
    return (
      <span>
        {' '}
        <Button
          bsSize="xsmall"
          bsStyle="info"
          onClick={this.toggle}
          data-id={this.props.id}
          children={this.state.isOpen ? 'close' : 'open'}
        />
        { this.state.isOpen && (
          this.state.data
          ? <div className="lrspace bspace">
            <Category category={this.state.data} />
          </div>
          : <Loading />
        )}
      </span>
    );
  }
}
