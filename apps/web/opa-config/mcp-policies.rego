package mcp.auth

import future.keywords.if
import future.keywords.in

# Default deny
default allow = false

# Allow if all conditions met
allow if {
    # Check endpoint is allowed for role template
    input.endpoint in data.policies[input.roleTemplate].allowed_endpoints
    
    # Check trust level meets minimum
    input.trustScore >= data.policies[input.roleTemplate].minTrustLevel
    
    # Check environment constraints
    not denied_by_environment
    
    # Check rate limiting
    not denied_by_rate_limit
    
    # Check time window restrictions
    not denied_by_time_window
}

# Environment constraints
denied_by_environment if {
    env := input.environment
    required_env := data.policies[input.roleTemplate].environment
    env != required_env
}

# Rate limiting
denied_by_rate_limit if {
    max_ops := data.policies[input.roleTemplate].constraints.maxConcurrentOps
    current_ops := count(data.audit_logs[input.agentId])
    current_ops >= max_ops
}

# Time window restrictions
denied_by_time_window if {
    time_window := data.policies[input.roleTemplate].constraints.timeWindow
    current_time := time.now_ns()
    start_time := parse_time(time_window.start)
    end_time := parse_time(time_window.end)
    
    current_time < start_time
    current_time > end_time
}

# Dual control requirement
requires_dual_control if {
    input.trustScore < 4
    data.policies[input.roleTemplate].constraints.requireDualControl == true
}

# Approval workflow
approval_required if {
    requires_dual_control
    input.action in ["delete", "modify", "deploy"]
}

# Helper functions
parse_time(time_str) = time.parse_rfc3339_ns(sprintf("2024-01-01T%s:00Z", [time_str]))
