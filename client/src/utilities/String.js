export function handleEmpty(string, showForEmpty="None") {
  return ((string && string.trim !== "") ? string : showForEmpty);
}

export function isPresent(string) {
  return string && string.trim !== "";
}
