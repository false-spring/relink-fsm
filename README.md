# relink-fsm

> ⚠️ work-in-progress ⚠️

Browser-based FSM tool for Relink.

- Supports opening/saving msgpack files.
- Supports opening/saving to JSON format (custom format)

The custom JSON format is the same as the original msgpack to JSON conversion, except the top-level object is converted to an array of { key, value } objects. This helps to preserve the duplicate keys that are present in the original msgpack file.

When opening/saving the msgpack file, the top-level keys are translated between the array of key-value pairs and msgpack map format w/ duplicate keynames automatically.

## TODOs

- Update parentGuids when connecting nodes
- When manually editing parentGuids, check to see if it is valid when saving. Then, re-update the connections.
- Be able to add nodes
- Create Transition edges when connecting FSM Nodes

## Developers

- Install [pnpm](https://pnpm.io/installation)
- `pnpm install`
- `pnpm run dev`
