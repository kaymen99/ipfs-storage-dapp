import styled from "styled-components";

export const Nav = styled.nav`
  background: #000;
  height: 80px;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem calc((100vw - 1200px) / 2);
  z-index: 10;
  margin-bottom: 50px;
`;

export const Title = styled.h1`
  color: #fff;
  align-text: left;
`;

export const Note = styled.div`
  color: #fff;
  align-text: center;
  font-size: 12px;
  padding-top: 10px;
`;
