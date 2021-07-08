import React from 'react';
import { shallow } from 'enzyme';
import DexRow from '../DexRow';

it('Expect to render DexRow component', () => {
  expect(shallow(<DexRow />)).toMatchSnapshot();
});
