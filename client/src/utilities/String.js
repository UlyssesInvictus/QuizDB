export function handleEmpty(string, showForEmpty="None") {
  return ((string && string.trim !== "") ? string : showForEmpty);
}
