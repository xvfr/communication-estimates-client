import { shallowMount } from '@vue/test-utils'
import helloWorld from '@/components/hello-world.vue'

describe('hello-world.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(helloWorld, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
