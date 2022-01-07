import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #2ca6a4;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  font-family: "Press Start 2P", cursive;
`;

export const MainGame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: black;
`;

export const SquirtleImage = styled.img`
  position: absolute;
  left: 0;
  bottom: 0;
  width: 35vw;
`;
