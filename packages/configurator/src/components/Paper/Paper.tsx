import React from "react";
import { Background } from "./Paper.styles";

const Paper: React.FC = ({ children }) => <Background>{children}</Background>;

export default Paper;
