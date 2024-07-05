//@req(next)

envName = '${env.envName}'
nodes = jelastic.env.control.GetEnvInfo(envName, session).nodes
addon = 'unknown'

for (i = 0; i < nodes.length; i++){
  // Logging the node group
  var logResult = jelastic.marketplace.console.WriteLog("Retrieved nodeGroup: " + nodes[i].nodeGroup, false);
      
  if (logResult.result != 0) {
    // Log an error message if logging fails
    jelastic.marketplace.console.WriteLog("Error logging node group: " + logResult.error, true);
  }
}

for (i = 0; i < nodes.length; i++){
  logResult = jelastic.marketplace.console.WriteLog("Retrieved nodeGroup: " + nodes[i].nodeGroup, true);
  if (nodes[i].nodeGroup == 'cp') {
    type = nodes[i].engineType || (nodes[i].activeEngine || {}).type;
    addon = type ? (type == 'java' ? 'maven' : 'other') : 'mount'

    logResult = jelastic.marketplace.console.WriteLog("Retrieved type: " + addon, false);
    if (logResult.result != 0) {
        // Log an error message if logging fails
        jelastic.marketplace.console.WriteLog("Error logging message: " + logResult.error, true);
    }
      
    if (addon == 'mount') return {result:99, error: 'deploy to custom containers is not implemented yet', type: 'warning'}
    if (addon == 'maven') envName += '-git-push-${fn.random(1000)}'
    
    resp = {result: 0, onAfterReturn: []}
    o = {}, o[next] = {addon: addon, type: type, envName: envName}
    resp.onAfterReturn.push(o)

    return resp
  }
}
return {result: 99, error: 'nodeGroup [cp] is not present in the topology', type: 'warning'}
