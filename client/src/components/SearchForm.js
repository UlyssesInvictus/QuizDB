import React from 'react';
import {Grid, Form, Input,
  Button, Divider, Container,
} from 'semantic-ui-react';

import SearchDropDown from './SearchDropDown';

class SearchForm extends React.Component {

  render() {
    return <div className="search"><Container>
      <Grid stackable columns={2} textAlign={"center"}
            verticalAlign='middle'>
        {/* Search input */}
        <Grid.Column width={11}>
          <Form.Field>
            <Input fluid placeholder={"Search for questions here!"} size='huge'/>
          </Form.Field>
        </Grid.Column>
        {/* Search buttons */}
        <Grid.Column width={5}>
          <Button.Group size='huge' compact>
            <Button attached='left' icon='search' content='Search' />
            <Button attached='right' icon='random' content='Random' />
          </Button.Group>
        </Grid.Column>
      </Grid>

      <Divider section/>

      <Grid stackable doubling columns='equal' textAlign='center'>
        <Grid.Row>
          <SearchDropDown/>
          <SearchDropDown/>
          <SearchDropDown/>
        </Grid.Row>
        <Grid.Row>
          <SearchDropDown/>
          <SearchDropDown/>
          <SearchDropDown/>
        </Grid.Row>
      </Grid>
    </Container></div>
  }
}
export default SearchForm;
