import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './app/store';

test('renders the post manager', () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(screen.getByText('Redux Toolkit Post Manager')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Add Post' })).toBeInTheDocument();
});
