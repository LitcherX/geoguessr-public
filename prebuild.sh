#!/bin/sh

# Change in .\node_modules\next-auth\lib\index.js
sed -i 's|import { headers } from "next/headers";|import { headers } from "next/headers.js";|' ./node_modules/next-auth/lib/index.js
sed -i 's|import { NextResponse } from "next/server";|import { NextResponse } from "next/server.js";|' ./node_modules/next-auth/lib/index.js
sed -i 's|import { reqWithEnvURL } from "./env";|import { reqWithEnvURL } from "./env.js";|' ./node_modules/next-auth/lib/index.js

# Change in .\node_modules\next-auth\lib\env.js
sed -i 's|import { NextRequest } from "next/server";|import { NextRequest } from "next/server.js";|' ./node_modules/next-auth/lib/env.js

# Change in .\node_modules\next-auth\lib\actions.js
sed -i 's|import { headers as nextHeaders, cookies } from "next/headers";|import { headers as nextHeaders, cookies } from "next/headers.js";|' ./node_modules/next-auth/lib/actions.js
sed -i 's|import { redirect } from "next/navigation";|import { redirect } from "next/navigation.js";|' ./node_modules/next-auth/lib/actions.js

echo "finished"