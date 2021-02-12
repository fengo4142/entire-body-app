import React from "react";
import classNames from "classnames";

import style from "./InputControl.module.scss";

export const InputControl = (props) => {
  const {
    type,
    value,
    label,
    isEmpty,
    isError,
    wrapperClass,
    inputClass,
    spanClass,
    onChange,
    children,
  } = props;

  const renderViewDefault = () => {
    return (
      <input
        className={classNames({
          [inputClass]: true,
          [style.empty]: isEmpty,
          [style.error]: isError,
        })}
        type={type}
        value={value}
        onChange={onChange}
      />
    );
  };

  return (
    <div className={classNames(style.wrapper, wrapperClass)}>
      <label>{label}</label>
      {children || renderViewDefault}
      <span className={classNames(style.new_period_time_filler, spanClass)} />
    </div>
  );
};
