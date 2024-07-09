//@req(next)

var envName = '${env.envName}';
var session = '${session}';
jelastic.marketplace.console.WriteLog(null, session, "Strating ...: ");
var nodes = jelastic.env.control.GetEnvInfo(envName, session).nodes;
var addon = 'unknown';

jelastic.marketplace.console.WriteLog(null, session, "Environment: " + envName);

for (var i = 0; i < nodes.length; i++) {
    jelastic.marketplace.console.WriteLog(null, session, "Nodegroup: " + nodes[i].nodeGroup);
    if (nodes[i].nodeGroup == 'cp') {
        var type = nodes[i].engineType || (nodes[i].activeEngine || {}).type;
        addon = type ? (type == 'java' ? 'maven' : 'vcs') : 'mount';
        
        if (addon == 'mount') {
            return {
                result: 99,
                error: 'deploy to custom containers is not implemented yet',
                type: 'warning'
            };
        }
        if (addon == 'maven') {
            envName += '-git-push-' + Math.floor(Math.random() * 1000);
        }

        var resp = {
            result: 0,
            onAfterReturn: []
        };
        var o = {};
        o[next] = {
            addon: addon,
            type: type,
            envName: envName
        };
        resp.onAfterReturn.push(o);

        return resp;
    }
}

return {
    result: 99,
    error: 'nodeGroup [cp] is not present in the topology',
    type: 'warning'
};