import React from "react";
import { render } from "@testing-library/react";
import Airspeed from "./Airspeed";

describe("Airspeed", () => {
  it("should render correctly", () => {
    const { asFragment } = render(<Airspeed speed={100} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("should rotate the airspeed needle to match the speed", () => {
    const { getByTestId, rerender } = render(<Airspeed speed={50} />);

    expect(getByTestId("indicator-needle")).toHaveStyle(
      "transform: rotate(190deg)"
    );

    rerender(<Airspeed speed={80} />);
    expect(getByTestId("indicator-needle")).toHaveStyle(
      "transform: rotate(250deg)"
    );
  });

  it("should limit airspeed to 160", () => {
    const { getByTestId, rerender } = render(<Airspeed speed={160} />);

    expect(getByTestId("indicator-needle")).toHaveStyle(
      "transform: rotate(410deg)"
    );

    rerender(<Airspeed speed={300} />);
    expect(getByTestId("indicator-needle")).toHaveStyle(
      "transform: rotate(410deg)"
    );
  });

  it("should ignore speed less than 0", () => {
    const { getByTestId, rerender } = render(<Airspeed speed={0} />);

    expect(getByTestId("indicator-needle")).toHaveStyle(
      "transform: rotate(90deg)"
    );

    rerender(<Airspeed speed={-50} />);
    expect(getByTestId("indicator-needle")).toHaveStyle(
      "transform: rotate(90deg)"
    );
  });
});
