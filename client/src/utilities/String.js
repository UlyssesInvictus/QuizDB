export function handleEmpty(string, showForEmpty="None") {
  return ((string && string.trim !== "") ? string : showForEmpty);
}

export function present(string) {
  return string && string.trim !== "";
}
