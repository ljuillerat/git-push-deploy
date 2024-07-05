//@req(next)

var envName = '${env.envName}';
var session = '${session}';
var nodes = jelastic.environment.control.GetEnvInfo(envName, session).nodes;
var addon = 'unknown';

for (var i = 0; i < nodes.length; i++) {
    jelastic.marketplace.console.WriteLog("Retrieved nodeGroup: " + nodes[i].nodeGroup);
    
    if (nodes[i].nodeGroup == 'cp') {
        var type = nodes[i].engineType || (nodes[i].activeEngine || {}).type;
        addon = type ? (type == 'java' ? 'maven' : 'other') : 'mount';

        jelastic.marketplace.console.WriteLog("Retrieved type: " + addon);
        
        if (addon == 'mount') {
            return {
                result: 99,
                error: 'deploy to custom containers is not implemented yet',
                type: 'warning'
            };
        }
        
        if (addon == 'maven') {
            envName += '-git-push-${fn.random(1000)}';
        }
        
        var resp = { result: 0, onAfterReturn: [] };
        var o = {};
        o[next] = { addon: addon, type: type, envName: envName };
        resp.onAfterReturn.push(o);

        return resp;
    }
}

return {
    result: 99,
    error: 'nodeGroup [cp] is not present in the topology',
    type: 'warning'
};