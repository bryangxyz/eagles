import React, { Component } from 'react';

import { mount, shallow, render }from 'enzyme';
import {expect} from 'chai';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';

configure({ adapter: new Adapter() });

import SlideVideo from '../frontend/components/Lesson/SlideVideo.js';

describe('<SlideVideo/>', function () {
  it('should have props for annotations', function () {
    const wrapper = mount(<SlideVideo/>);
    expect(wrapper.props().annotations).to.be.undefined;
  });

});
