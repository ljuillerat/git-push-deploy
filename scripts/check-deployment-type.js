//@req(next)

var envName = '${env.envName}';

log(appid, session, "Starting ...");
var nodes = jelastic.environment.control.GetEnvInfo(envName, session).nodes;
var addon = 'unknown';

log(appid, session, "Environment: " + envName);

if(nodes) {
    for (var i = 0; i < nodes.length; i++) {
        log(appid, session, "Nodegroup: " + nodes[i].nodeGroup);
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
}

function log(appid, session, message) {
    if (jelastic.marketplace && jelastic.marketplace.console && message) {
        return jelastic.marketplace.console.WriteLog(String(appid), String(session), String(message));
    }

    return { result : 0 };
}

return {
    result: 99,
    error: 'nodeGroup [cp] is not present in the topology ' + envName + ' ' + session,
    type: 'warning'
};