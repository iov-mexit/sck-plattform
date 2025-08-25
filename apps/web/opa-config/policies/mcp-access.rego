package mcp.access

import future.keywords.if
import future.keywords.in

default allow := false

allow if {
    input.method == "GET"
    input.path = "/api/v1/read"
    input.user.role == "reader"
}

allow if {
    input.method == "POST"
    input.path = "/api/v1/write"
    input.user.role == "writer"
    input.user.loa_level >= 4
}

deny if {
    input.method == "DELETE"
    input.path = "/api/v1/admin"
    input.user.role != "admin"
}
