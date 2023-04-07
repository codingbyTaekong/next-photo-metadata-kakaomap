import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset};
  h1 {
    font-weight: 700;
  }
  html,
  body {
    width: 100%;
    height: 100%;
  }
  * {
    margin: 0;
    padding: 0;
  }
  #__next {
    margin: 0 auto;
  }
  
  html {
    /* font-size: 62.5%; */
    
  }
  
  * {
    box-sizing: border-box;
  }
  
  body, button {
    /* font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, */
    /* Helvetica Neue, sans-serif; */
  }
  
  button {
    cursor: pointer;
    border: none;
    outline: none;
    background-color: transparent;
    -webkit-tap-highlight-color : transparent;
  }
  
  a, a:visited {
    text-decoration: none;
    color: black;
  }
  :root {
  }
`;

export default GlobalStyle;
