import json
import os

with open('temp.jsonl', 'r') as f:
    for line in f:
        data = json.loads(line)
        # Dig into the tool calls to find CodeContent and TargetFile
        # The structure is usually complex, let's search recursively for CodeContent
        def find_write_args(obj):
            if isinstance(obj, dict):
                if 'CodeContent' in obj and 'TargetFile' in obj:
                    return obj
                for v in obj.values():
                    res = find_write_args(v)
                    if res: return res
            elif isinstance(obj, list):
                for item in obj:
                    res = find_write_args(item)
                    if res: return res
            return None
            
        args = find_write_args(data)
        if args:
            filepath = args['TargetFile']
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            with open(filepath, 'w', encoding='utf-8') as out:
                out.write(args['CodeContent'])
                print(f"Wrote {filepath}")
