#!/usr/bin.env zx

import { $, LogEntry } from "zx";
import { isDev } from "./isDev";

/**
 * Basic shell implementation that supports the commands needed for the extension
 * There's a better way to write this, but not today
 * */

const sourceRoots = ["~/.profile", "~/.bashrc", "~/.zprofile", "~/.zshrc"].map((s) => `source ${s}`);

$.shell = "/bin/bash";
$.prefix = sourceRoots.join(";") + ";";

$.env = {
  PATH: `/usr/bin:/opt/homebrew/bin:/usr/bin/local;${process.env.PATH}`,
};

// bug with zx + zsh, had to fix it manually
$.quote = function quote(arg: string) {
  if (/^[a-z0-9/_.\-@:=]+$/i.test(arg) || arg === "") {
    return arg;
  }

  return (
    `$'` +
    arg
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/\f/g, "\\f")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/\v/g, "\\v")
      .replace(/\0/g, "\\0") +
    `'`
  );
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */

if (isDev()) {
  console.log("running development mode");

  $.log = (entry: LogEntry) => {
    if (entry.kind === "cmd") {
      console.info(entry.cmd);
    }
  };
}
export { $ };
